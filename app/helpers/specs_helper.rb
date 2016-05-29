module SpecsHelper
    
    def render_specs(specs, filtered_spec_ids)
        spec_html = ""
        specs.each do |spec|
            spec_html << render_spec(spec, filtered_spec_ids)
        end
        
        spec_html
    end
    
    def render_spec(spec, filtered_spec_ids)
        spec_html = ""
        if (filtered_spec_ids.nil? || filtered_spec_ids.include?(spec[:id]))
            spec_html << "<li id='li#{spec[:id]}' class='spec-li' data-spec-id='#{spec[:id]}' data-project-id='#{spec[:project_id]}'>"
            spec_html << "<%= render partial: 'spec', object: spec %>"
            if (spec[:children])
                spec_html << "<ul class='spec-list' data-parent='#{spec[:id]}'>"
                spec[:children].each do |spec_child|
                    spec_html << render_spec(spec_child, filtered_spec_ids)
                end
                spec_html << "</ul>"
            end
        
            spec_html << "</li>"
        end
        
        spec_html
    end
    
    def render_spec_section
    
    end
    
end
