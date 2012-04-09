# Lowdown: Make Something Useful

Lowdown helps software development teams focus on what they should build, when they should do it, and why they should bother doing it at all.

## Should You Use Lowdown?

Lowdown aims to support Behaviour-Driven Development.

> This approach acts as a brake on the tendencies of technologists to get carried away in their enthusiasm for the technology and on the business from getting carried away with dreams of their ideal system. It makes it clear to both groups that software is an expensive thing, and that trade-offs usually need to be made in the real world, thus mitigating the temptation of software users to ask for a Rolls-Royce solution, when all they really need is a motor-scooter and for software developers to try and build an aircraft carrier when all that the users need is a row-boat!
> 
> [http://behaviour-driven.org/WheresTheBusinessValue](http://behaviour-driven.org/WheresTheBusinessValue)

## Features

* Prioritize: drag features and milestones to re-order development or adjust iteration hours
* Edit Features: collaborate on features stories with the entire team
* Edit Steps: breakdown features into scenarios and individual steps in order to focus behavior towards business value
* Folders: organize stories into releases or iterations using folders
* Plan: use milestones to organize into iterations. Totals give insight into estimated time and cost
* Estimate: use the time/cost estimate to help you prioritize your features against a real and finite budget.
* Collaborators: invite others to view your project
* Export: once you're ready, kickstart your project's test suite

## Hosted version

You can find a free, hosted, mostly unsupported version at [http://lowdownapp.com](http://lowdownapp.com).

## Installed version

Run your own copy of Lowdown on your own server.

* Clone
* Install ruby 1.8.7 (later versions may work, let us know!)
* Install bundler
* `bundle install`
* Create a database.yml for your database
* `rake db:schema:load`
* `(ruby) script/server`

## Contributing

If you've found a bug, want to submit a patch, or have a feature request, please enter a ticket into our github tracker:

<http://github.com/databasically/lowdown/issues>

We strongly encourage bug reports to come with failing tests or at least a reduced example that demonstrates the problem. Similarly, patches should include tests. Feel free to send a pull request early though, if you just want some feedback or a code review before preparing your code to be merged.

## Authorship

Lowdown was originally a Rails Rumble contest entry by [Paul du Coudray](http://twitter.com/paulducoudray), [Sean Cribbs](http://twitter.comseancribbs), [Wes Garrison](http://twitter.com/wesgarrison), and [Scotty Moon](@scottymoon).

## License

Lowdown is released under the MIT license:

* [www.opensource.org/licenses/MIT](http://www.opensource.org/licenses/MIT)

![mascot](http://lowdownapp.heroku.com//images/mascot.png)