desc 'pull master, rebase the current branch on master'
task :rebase do
  branch = current_branch
  raise 'specify BRANCH=branchname to rebase and merge' unless branch
  system("git checkout master") &&
  system("git pull origin master") &&
  system("git checkout #{branch}")
end

desc 'pull master, rebase the current branch on master, then merge'
task :rebase_merge => :rebase do
  branch = current_branch
  system("git rebase master") &&
  system("git checkout master") &&
  system("git merge #{branch}")
end

desc 'pull master, rebase and merge, then push and switch back to branch'
task :rm_push => :rebase_merge do
  branch = current_branch
  system("git push origin master") && system("git checkout #{branch}")
end

def current_branch
  @branch ||= ENV['BRANCH'] || `git branch`.match(/^\* (.*)$/) && $1 != 'master' && $1
end
