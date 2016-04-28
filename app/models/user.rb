class User < ActiveRecord::Base
  has_many :conversations, :foreign_key => :sender_id
  # for demo purposes
end
