module FeaturesHelper
  def scenario_dom_id(feature, index)
    "#{dom_id(feature)}_scenarios_#{index+1}"
  end
end
