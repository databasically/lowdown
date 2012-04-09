class Cuke::Sexp
  FEATURE_REGEXP = /^Feature:(.*)$/i
  VALUE_PROP_REGEXP = /^(In order to|As a|I want|)(.*)$/i

  def initialize(sexp)
    @sexp = sexp
  end
  
  def to_hash
    header = @sexp[2]
    elements = @sexp[3..-1]
    parse_header(header).merge(
      :elements => xf_elements(elements).compact,
      :tags => elements.select {|e| e.first == :tag }.map(&:last),
      :comments => elements.select {|e| e.first == :comment }.map(&:last)
    )
  end
  
  def parse_header(header)
    lines = header.split("\n").reject {|line| line =~ FEATURE_REGEXP }
    lines = lines.map do |line|
      label, value = $1.humanize, $2.strip if line.strip =~ VALUE_PROP_REGEXP
      {:label => label, :value => value}
    end
    {
      :name => header.match(FEATURE_REGEXP)[1].strip,
      :value_prop => lines
    }
  end
  
  def xf_elements(elements)
    elements.map {|e| xf_element(e) }
  end
  
  def xf_element(element)
    case element.first
    when :scenario
      xf_scenario(element)
    when :scenario_outline
      xf_scenario_outline(element)
    end
  end
  
  def xf_scenario(element)
    {
      :type => 'scenario',
      :line => element[1],
      :name => element[3],
      :steps => element[4..-1].select{|e| e.first == :step_invocation }.map {|s| xf_step_invocation(s) },
      :comments => element[4..-1].select{|e| e.first == :comment }.map(&:last),
      :tags => element[4..-1].select {|e| e.first == :tag }.map(&:last)
    }
  end
  
  def xf_scenario_outline(element)
    steps = element[3..-1].select {|e| e.first == :step }.map {|s| xf_step(s) }
    comments = element[3..-1].select {|e| e.first == :comment }.map {|c| xf_comment(c.last)}
    tags = element[3..-1].select {|e| e.first == :tag }.map(&:last)
    examples = element[3..-1].select {|e| e.first == :examples }.map {|e| xf_example(e) }
    {
      :type => 'outline',
      :line => steps.first[:line],
      :name => element[2],
      :steps => steps,
      :comments => comments,
      :tags => tags,
      :examples => examples
    }
  end
  
  def xf_step_invocation(step)
    {
       :keyword => step[2],
       :name => step[3],
       :line => step[1]
    }.tap do |hash|
      hash.merge!(xf_multiline(step[4])) if step[4]
    end
  end

  alias :xf_step :xf_step_invocation
  
  def xf_example(examples)
    {:name => examples[2], :table => xf_table(examples.last)}
  end
  
  def xf_multiline(multiline)
    case multiline.first
    when :table
      {:table => xf_table(multiline)}
    when :py_string
      {:py_string => multiline[1]}
    end
  end
  
  def xf_table(table)
    table[1..-1].map do |row| # [:table, [:row, line, cells+]+]
      row[2..-1].map(&:last)  # [:cell, value]
    end
  end
  
  def xf_comment(comment)
    comment.sub(/^#/, '')
  end
end