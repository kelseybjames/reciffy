class Recipe < ActiveRecord::Base

	belongs_to :user
	has_many :recipeingredients
	has_many :taggings, -> { order('created_at ASC') }, as: :taggable, dependent:   :destroy
	has_many :tags, through: :taggings

	accepts_nested_attributes_for :recipeingredients,
	  :allow_destroy => true,
      :reject_if     => :all_blank
end
