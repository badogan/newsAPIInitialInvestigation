class AddSaveforlaterToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :saveforlater, :json, array: true, default: []
  end
end
