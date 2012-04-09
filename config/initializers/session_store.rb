# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_lowdownapp_session',
  :secret      => '6379b664222f94e10c0b4201e8897e7ded372e72c233a10e93a7aa6baa61e275edc00e6f91b9a02ffebd23ce6b4f893a817071a1be1edf3d6a9714315d0da7c6'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store
