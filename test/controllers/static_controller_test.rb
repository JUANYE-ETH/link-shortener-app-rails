require "test_helper"

class StaticControllerTest < ActionDispatch::IntegrationTest
  test "should get shorten" do
    get static_shorten_url
    assert_response :success
  end
end
