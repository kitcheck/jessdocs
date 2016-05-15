require 'test_helper'

class TagTypeGroupsControllerTest < ActionController::TestCase
  setup do
    @tag_type_group = tag_type_groups(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:tag_type_groups)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create tag_type_group" do
    assert_difference('TagTypeGroup.count') do
      post :create, tag_type_group: {  }
    end

    assert_redirected_to tag_type_group_path(assigns(:tag_type_group))
  end

  test "should show tag_type_group" do
    get :show, id: @tag_type_group
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @tag_type_group
    assert_response :success
  end

  test "should update tag_type_group" do
    patch :update, id: @tag_type_group, tag_type_group: {  }
    assert_redirected_to tag_type_group_path(assigns(:tag_type_group))
  end

  test "should destroy tag_type_group" do
    assert_difference('TagTypeGroup.count', -1) do
      delete :destroy, id: @tag_type_group
    end

    assert_redirected_to tag_type_groups_path
  end
end
