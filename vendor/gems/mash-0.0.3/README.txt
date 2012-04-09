= Mash (Mocking Hash)

http://github.com/mbleigh/mash

== DESCRIPTION:

Mash is an extended Hash that gives simple pseudo-object functionality
that can be built from hashes and easily extended. It is designed to
be used in RESTful API libraries to provide easy object-like access 
to JSON and XML parsed hashes.

== SYNOPSIS:
  
  mash = Mash.new
  mash.name? # => false
  mash.name # => nil
  mash.name = "My Mash"
  mash.name # => "My Mash"
  mash.name? # => true
  mash.inspect # => <Mash name="My Mash">
  
  mash = Mash.new
  # use bang methods for multi-level assignment
  mash.author!.name = "Michael Bleigh"
  mash.author # => <Mash name="Michael Bleigh">

== INSTALL:

RubyGem:

  sudo gem install mash
  
Git:

  git clone git://github.com/mbleigh/mash.git

== LICENSE:

Copyright (c) 2008 Michael Bleigh

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
