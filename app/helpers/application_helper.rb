# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def project_name
    if @project
      if @project.new_record?
        "[New project]"
      else
        @project.name
      end
    else
      "[No project]"
    end
  end

  def referrer_or(url)
    if request.env['HTTP_REFERER'] && !current_page?(request.referrer)
      :back
    else
      url
    end
  end
end
