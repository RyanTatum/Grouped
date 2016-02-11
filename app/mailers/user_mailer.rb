class UserMailer < ActionMailer::Base
  default from: "no-reply@grouped.com"
  
  def welcome_email(email, name)
	  @email = email
	  @name = name
	  mail(:to => email, :subject => "Thank you for signing up!")
  end
  
  
  
  #def new_email(email)
  #mail(:to => email, :subject => "Verification Email")
  #end
end