desc 'dump databases, compress, rsync away'
task :backup do
  BACKUP_LOCATION = '/rails/lowdownapp/shared/backups/'
  BACKUP_REMOTE = "web@67.23.34.33:#{BACKUP_LOCATION} "
  password = YAML.load_file("/rails/lowdown/shared/lowdownapp.yml")["production"]["password"]
  command = []
  command << "cd #{BACKUP_LOCATION}"
  command << "mysqldump -u root --password='#{password}' --all-databases | gzip -c > lowdown-backup-#{Time.now.strftime('%Y%m%d')}.sql.gz"
  command << "rsync -a --delete -e 'ssh -p 42424' #{BACKUP_LOCATION} #{BACKUP_REMOTE}" 
  # puts command.join(' && ')
  system command.join(' && ')
end