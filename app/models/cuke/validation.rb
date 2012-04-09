module Cuke::Validation
  def validate_cuke(text, name="features/validating.feature")
    mother = Cucumber::StepMother.new
    feature_file = Cucumber::FeatureFile.new(name, text)
    begin
      ast = feature_file.parse(mother, {})
      [true, ast]
    rescue Cucumber::Parser::SyntaxError => err
      [false, extract_cuke_error(err.message)]
    end
  end
  
  private
  def extract_cuke_error(message)
    {:line => $1.to_i, :expected => $2} if message =~ /^.+:(\d+):\d+: Parse error, expected (.*)\.$/m
  end
end