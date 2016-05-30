module SpecsHelper
    
    def render_specs(specs, filtered_spec_ids, can_edit, ticket_hash, tag_hash)
        spec_html = ""
        specs.each do |spec|
            spec_html << render_spec(spec, filtered_spec_ids, can_edit, ticket_hash, tag_hash)
        end
        
        spec_html
    end
    
    def render_spec(spec, filtered_spec_ids, can_edit, ticket_hash, tag_hash)
        spec_html = ""
        if (filtered_spec_ids.nil? || filtered_spec_ids.include?(spec[:id]))
            spec_html << "<li id='li#{spec[:id]}' class='spec-li' data-spec-id='#{spec[:id]}' data-project-id='#{spec[:project_id]}'>"
            spec_html << render_spec_section(spec, can_edit, ticket_hash, tag_hash)
            if (spec[:children])
                spec_html << "<ul class='spec-list' data-parent='#{spec[:id]}'>"
                spec[:children].each do |spec_child|
                    spec_html << render_spec(spec_child, filtered_spec_ids, can_edit, ticket_hash, tag_hash)
                end
                spec_html << "</ul>"
            end
        
            spec_html << "</li>"
        end
        
        spec_html
    end
    
    def render_spec_section(spec, can_edit, ticket_hash, tag_hash)
        spec_html = "<div class='spec section'  id='#{spec[:id]}' data-root='#{spec[:root]}'>"
        spec_html << "<div class='side-buttons left'>"
            
        if can_edit
            spec_html << "<a class='btn-flat btn-square active-btn drag-button side-button'>"
            spec_html << "<i class='material-icons tiny-icon'>drag_handle</i>"
            spec_html << "</a>"
            spec_html << "<a class='btn-flat btn-square edit-button active-btn side-button'>"
            spec_html << "<i class='material-icons tiny-icon'>mode_edit</i>"
            spec_html << "</a>"
        end
        
        css_class = (@comment_array && @comment_array.include?(spec[:id]) ) ? "sticky-btn" : ""
        comment_color = (@comment_array && @comment_array.include?(spec[:id]) ) ? "deep-purple-text darken-2" : ""
        
        spec_html << link_to(comments_path(:spec_id => spec[:id]), 
                            remote: true,
                            class: "btn-flat btn-square comment-button active-btn side-button #{css_class}") do
            "<i class='material-icons #{comment_color}'>comment</i>".html_safe
        end
        
        spec_html << "</div>"
   
        spec_html << "<div class='spec-data'>"
        
        spec_html << render_spec_data(spec, ticket_hash, tag_hash)
        spec_html << "</div>"
        
        spec_html << "<div class='spec-buttons editable'>"
        spec_html << "</div>"
        spec_html << "</div>"

        spec_html
    end
    
    
    def render_spec_data(spec, ticket_hash, tag_hash)
        spec_html = "<span class='spec-words'>"
        spec_html << spec[:description]
        spec_html << "</span>"
        spec_html << "<span class='tickets'>"
        
        if ticket_hash[spec[:id]]
            spec_html << ((render partial: "tickets/show", collection: ticket_hash[spec[:id]], as: :ticket) || "")
        end

        spec_html << "</span>"

        spec_html << "<span class='tags'>"
        
        if tag_hash[spec[:id]].any?
            tag_hash[spec[:id]].each do |tag_array|
        
                spec_html << (render partial: "tags/show", 
                                    object: tag_array, 
                                    as: :tag )
            end
        end
        
        spec_html << "</span>"
        
        spec_html
    end
end
