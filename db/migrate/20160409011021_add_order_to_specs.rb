class AddOrderToSpecs < ActiveRecord::Migration
  def change
    add_column :specs, :spec_order, :integer
    
    add_order(Spec.roots)
  end
  
  def add_order(specs)
    specs.order(created_at: :asc).each_with_index do |spec, i|
      spec.update!(:spec_order => i)
      add_order(spec.children)
    end
  end
end
