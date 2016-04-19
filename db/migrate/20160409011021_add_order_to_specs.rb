class AddOrderToSpecs < ActiveRecord::Migration
  def change
    add_column :specs, :spec_order, :integer
    
    add_order_by_project
  end
  
  def add_order_by_project
    Project.all.each do | project |
      add_order(Spec.for_project(project.id).roots)
    end
  end
  
  def add_order(specs)
    specs.order(created_at: :asc).each_with_index do |spec, i|
      spec.update!(:spec_order => (i+1) )
      add_order(spec.children)
    end
  end
end
