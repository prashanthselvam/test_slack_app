import os
import logging
from datetime import datetime

from slack_bolt import App
from threads_app import insert_favorite_thread

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(" "message)s",
)

# Initializes your app with your bot token and signing secret
app = App(
    token=os.environ.get("SLACK_BOT_TOKEN"),
    signing_secret=os.environ.get("SLACK_SIGNING_SECRET"),
)


@app.shortcut("save_thread")
def handle_shortcuts(client, ack, body, logger):
    ack()

    logger.info(body)

    link_response = client.chat_getPermalink(
        channel=body["channel"]["id"], message_ts=body["message_ts"]
    )
    logger.info(link_response)

    # Extract the username
    user = body["user"]["username"]
    # Extract the message text
    content = body["message"]["text"]
    # Extract the message timestamp
    timestamp_raw = body["message"]["ts"]
    timestamp = int(float(timestamp_raw))

    # Reply count
    reply_count = int(body["message"].get("reply_count", 0))

    # Get the link
    link = link_response["permalink"]

    insert_favorite_thread(user, content, link, reply_count, timestamp)


# The echo command simply echoes on command
@app.command("/save")
def repeat_text(ack, respond, command):
    # Acknowledge command request
    ack()
    respond(f"wassup guy")


@app.message(":wave:")
def say_hello(message, say):
    user = message["user"]
    say(f"Hi there, <@{user}>!")


@app.event("app_home_opened")
def update_home_tab(client, event, logger):
    logger.info(event)
    try:
        # views.publish is the method that your app uses to push a view to the Home tab
        client.views_publish(
            # the user that opened your app's app home
            user_id=event["user"],
            # the view object that appears in the app home
            view={
                "type": "home",
                "callback_id": "home_view",
                # body of the view
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Welcome to your _App's Home_* :tada:",
                        },
                    },
                    {"type": "divider"},
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.",
                        },
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {"type": "plain_text", "text": "Click me!"},
                            }
                        ],
                    },
                ],
            },
        )
    except Exception as e:
        logger.error(f"Error publishing home tab: {e}")


# Start your app
if __name__ == "__main__":
    app.start(port=int(os.environ.get("PORT", 8000)))
