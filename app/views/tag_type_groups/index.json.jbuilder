json.array!(@tag_type_groups) do |tag_type_group|
  json.extract! tag_type_group, :id
  json.url tag_type_group_url(tag_type_group, format: :json)
end
