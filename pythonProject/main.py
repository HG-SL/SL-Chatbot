import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

API_KEY = os.getenv('API_KEY')
bot = telebot.TeleBot(API_KEY)

def markup_inline():
    markup = InlineKeyboardMarkup()
    markup.width = 2
    markup.add(
        InlineKeyboardButton("Support", callback_data="su"),
        InlineKeyboardButton("License", callback_data="li"),
    )
    return markup

def message_handler(message):
    return True

@bot.message_handler(func=message_handler)
def init_message(message):
    bot.send_message(message.chat.id, "Hello how can I help you?", reply_markup=markup_inline())

@bot.callback_query_handler(func=message_handler)
def callback_query(call):
    if call.data == "su":
        bot.answer_callback_query(call.id, "Coming soon..")
    elif call.data == "li":
        bot.answer_callback_query(call.id, "good luck with that")

bot.infinity_polling()
