class Milestone < ProjectItem
  def number
    folder.milestones.before(self).count + 1
  end

  def previous
    folder.milestones.before(self).last
  end

  def feature_count
    features.size
  end

  def scenario_count
    features.sum(:scenario_count)
  end

  def sum_hours
    features.sum(:hours)
  end
  
  def cost
    sum_hours * project.rate
  end
  
  def features
    if previous
      folder.features.between(previous, self)
    else
      folder.features.before(self)
    end
  end
  
  def to_json(options={})
    super({:only => [:id], :methods => [:feature_count, :scenario_count, :sum_hours, :cost]}.merge(options))
  end
end
