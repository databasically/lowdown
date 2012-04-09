module MilestonesHelper
  def milestones_for_json
    @project.milestones.all.to_a.map do |milestone|
      {:id => milestone.id,
       :html => render(:partial => milestone)}
    end
  end
end
