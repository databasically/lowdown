class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :fullname
      t.string :email
      t.string :timezone
      t.string :language
      t.string :crypted_password
      t.string :password_salt
      t.string :openid_identifier
      t.string :perishable_token
      t.string :persistence_token

      t.timestamps
    end
    
    add_index :users, :email
    add_index :users, :openid_identifier
  end

  def self.down
    drop_table :users
  end
end
