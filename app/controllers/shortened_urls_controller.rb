class ShortenedUrlsController < ApplicationController
    def create
      @shortened_url = ShortenedUrl.new(shortened_url_params)
  
      if @shortened_url.save
        render json: { short_url: url_for(controller: "shortened_urls", action: "show", unique_code: @shortened_url.unique_code) }
      else
        render json: { error: @shortened_url.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def show
      @shortened_url = ShortenedUrl.find_by(unique_code: params[:unique_code])
  
      if @shortened_url
        redirect_to @shortened_url.original_url, allow_other_host: true
      else
        render json: { error: 'Shortened URL not found' }, status: :not_found
      end
    end
  
    private
  
    def shortened_url_params
      params.require(:shortened_url).permit(:original_url)
    end
  end  