module Cuke::Tree
  extend self
  
  def normalize(value)
    case value
    when Hash
      if value.keys.all? {|k| k.to_s =~ /^\d+$/}
        normalize(normalize_table(value))
      else
        table = normalize_table(value.delete(:table) || value.delete('table'))
        new_hash = value.inject({}){|h,(k,v)| h[fix_key(k)] = normalize(v); h}
        new_hash.merge('table' => table) if table
        new_hash
      end
    when Array
      value.map {|v| normalize(v) }
    else
      value
    end
  end
  
  def normalize_table(table)
    if table && table.respond_to?(:keys)
      table.sort_by {|k,v| k.to_i }.map(&:last)
    else
      table
    end
  end
  
  def fix_key(k)
    k.to_s.sub(/_attributes$/, '')
  end
end