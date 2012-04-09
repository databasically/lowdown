class ::String
  def indent(amount)
    split("\n").map {|line| (" " * amount) + line }.join("\n")
  end
end

class Cuke::Text
  def initialize(hash)
    @hash = Mash.new(hash)
  end

  def to_text
    flatjoin [comment, tags, feature_name, value_prop, elements]
  end

  def feature_name
    "Feature: #{@hash[:name]}"
  end

  def value_prop
    flatbreak(@hash[:value_prop].map do |prop|
      [prop[:label], prop[:value]].join(" ").indent(2)
    end) if @hash[:value_prop]
  end

  def tags(hash=@hash, indent=0)
    hash[:tags].map {|t| "@#{t}" }.join(" ").indent(indent) if hash[:tags]
  end

  def comment(hash=@hash, indent=0)
    hash[:comments].map {|c| ("# "+c).indent(indent) } if hash[:comments]
  end

  def elements
    @hash[:elements].map do |e|
      case e[:type]
      when 'outline'
        outline(e)
      when 'scenario'
        scenario(e)
      end 
    end if @hash[:elements]
  end
  
  def scenario(scenario)
    flatbreak [comment(scenario, 2), tags(scenario, 2), "Scenario: #{scenario[:name]}".indent(2), steps(scenario[:steps])]
  end
  
  def outline(outline)
    flatjoin [comment(outline, 2), tags(outline, 2),"Scenario Outline: #{outline[:name]}".indent(2), steps(outline[:steps]), examples(outline[:examples])]
  end
  
  def examples(exs)
    flatjoin(exs.map do |ex|
      ["","Examples: #{ex[:name]}".indent(4), table(ex[:table],8), ""].join("\n")
    end)
  end
  
  def steps(steps)
    Array(steps).compact.map do |step|
      ["#{step[:keyword]} #{step[:name]}".indent(4), table(step[:table]), py_string(step[:py_string])]
    end
  end
  
  def table(table, indent=6)
    if table
      table.map do |row|
        "| #{row.join(' | ')} |"
      end.join("\n").indent(indent)
    end
  end
  
  def py_string(string, indent=6)
    if string
      ['"""',string,'"""'].join("\n").indent(indent)
    end
  end
  
  def flatbreak(array)
    flatjoin(array) << "\n"
  end
  
  def flatjoin(array)
    array.flatten.reject(&:blank?).join("\n")
  end
end
