module SpecsHelper
    def nested_specs(specs)
        specs.map do |spec, children|
            render(spec) + content_tag(:div, nested_specs(children), :class => 'nested-children')
        end.join.html_safe
    end
end
