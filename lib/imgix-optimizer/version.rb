require 'json'

module Imigix
  module Optimizer
    package_file = File.expand_path('../../package.json', __dir__)
    VERSION = JSON.parse(File.read(package_file))['version']
  end
end
