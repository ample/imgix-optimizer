lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'imgix-optimizer/version'

Gem::Specification.new do |s|
  s.name          = 'imgix-optimizer'
  s.version       = Imgix::Optimizer::VERSION
  s.authors       = ['Sean C Davis']
  s.email         = 'sean@helloample.com'
  s.summary       = ''
  s.homepage      = 'https://www.ample.co/'
  s.license       = 'MIT'
  s.require_paths = ['lib']
  s.files         = `git ls-files`.split($/)

  s.add_development_dependency 'rake'
end
