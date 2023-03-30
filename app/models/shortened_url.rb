require 'uri'

class ShortenedUrl < ApplicationRecord
  validates :original_url, presence: true
  validate :validate_original_url

  before_create :generate_unique_code

  private

  def validate_original_url
    uri = URI.parse(original_url)

    unless uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)
      errors.add(:original_url, 'must be a valid HTTP or HTTPS URL')
    end
  rescue URI::InvalidURIError
    errors.add(:original_url, 'must be a valid URL')
  end
  
    def generate_unique_code
      loop do
        self.unique_code = SecureRandom.alphanumeric(6)
        break unless ShortenedUrl.exists?(unique_code: unique_code)
      end
    end
  end