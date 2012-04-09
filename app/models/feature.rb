class Feature < ProjectItem
  DEFAULTS = {
    :tree => {
      :name => "New feature",
      :value_prop => [
          {:label => "In order to", :value => ""},
          {:label => "As a", :value => ""},
          {:label => "I want", :value => ""}
        ],
      :elements => [
          {:type => "scenario",
           :line => 6,
           :name => "",
           :steps => [{:keyword => "Then", :line => 7, :name => ""}]
          }
        ]
    }
  }

  include Cuke::Validation
  validate :parses_as_cuke
  attr_accessor :syntax_error_line, :syntax_error_message

  def self.new_with_defaults(params={})
    new(DEFAULTS.dup.merge(params))
  end

  serialize :tree
  def tree_mash
    @tree_mash ||= Mash.new(self.tree)
  end

  def tree=(value)
    @tree_mash = nil
    self[:tree] = Cuke::Tree.normalize(value)
    self[:name] = value[:name] || value['name'] || name
    self[:scenario_count] = tree_mash[:elements].try(:size) || 0
    self[:hours] = Array(tree_mash[:elements]).compact.map{|e| Array(e[:comments]) }.flatten.reject(&:blank?).map(&:to_i).sum
    self[:formatted] = Cuke::Text.new(self.tree).to_text
  end

  def filename
    result = name.try(:parameterize).try(:underscore)
    result.blank? ? "unnamed-#{self.id}.feature" : "#{result}.feature"
  end

  def cost
    project.rate * (hours || 0)
  end

  def to_json(options={})
    super({:only => [:id, :name, :text, :created_at, :updated_at, :position],
           :methods => [:scenario_count],
           :include => :project}.merge(options))
  end
  
  protected
  def parses_as_cuke
    self.syntax_error_line = nil
    self.syntax_error_message = nil

    result, object = validate_cuke(formatted, filename)
    if result
      self[:tree] = Cuke::Sexp.new(object.to_sexp).to_hash
    else
      self.syntax_error_line = object[:line]
      self.syntax_error_message = object[:expected]
      errors.add_to_base("Invalid feature syntax on #{object[:line]}: expected #{object[:expected]}")
    end
  end
end
