# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create(user_id: 'Bot', name: 'Bot', email: 'bot@bot.com')
User.create(user_id: 'Ryan Tatum', name: 'Ryan Tatum', email: 'ryant9211@gmail.com')