package SL::Controller::Part;

use strict;
use parent qw(SL::Controller::Base);

use Clone qw(clone);
use SL::DB::Part;
use SL::Controller::Helper::GetModels;
use SL::Locale::String qw(t8);
use SL::JSON;

use Rose::Object::MakeMethods::Generic (
  'scalar --get_set_init' => [ qw(parts models) ],
);

# safety
__PACKAGE__->run_before(sub { $::auth->assert('part_service_assembly_edit') },
                        except => [ qw(ajax_autocomplete part_picker_search part_picker_result) ]);

sub action_ajax_autocomplete {
  my ($self, %params) = @_;

  my $value = $::form->{column} || 'description';

  # if someone types something, and hits enter, assume he entered the full name.
  # if something matches, treat that as sole match
  # unfortunately get_models can't do more than one per package atm, so we d it
  # the oldfashioned way.
  if ($::form->{prefer_exact}) {
    my $exact_matches;
    if (1 == scalar @{ $exact_matches = SL::DB::Manager::Part->get_all(
      query => [
        obsolete => 0,
        SL::DB::Manager::Part->type_filter($::form->{filter}{type}),
        or => [
          description => { ilike => $::form->{filter}{'all:substr::ilike'} },
          partnumber  => { ilike => $::form->{filter}{'all:substr::ilike'} },
        ]
      ],
      limit => 2,
    ) }) {
      $self->parts($exact_matches);
    }
  }

  my @hashes = map {
   +{
     value       => $_->$value,
     label       => $_->long_description,
     id          => $_->id,
     partnumber  => $_->partnumber,
     description => $_->description,
     type        => $_->type,
     unit        => $_->unit,
    }
  } @{ $self->parts }; # neato: if exact match triggers we don't even need the init_parts

  $self->render(\ SL::JSON::to_json(\@hashes), { layout => 0, type => 'json', process => 0 });
}

sub action_test_page {
  $::request->{layout}->add_javascripts('autocomplete_part.js');

  $_[0]->render('part/test_page');
}

sub action_part_picker_search {
  $_[0]->render('part/part_picker_search', { layout => 0 }, parts => $_[0]->parts);
}

sub action_part_picker_result {
  $_[0]->render('part/_part_picker_result', { layout => 0 });
}

sub init_parts {
  $_[0]->models->get;
}

sub init_models {
  my ($self) = @_;

  SL::Controller::Helper::GetModels->new(
    controller => $self,
    sorted => {
      _default  => {
        by => 'partnumber',
        dir  => 1,
      },
      partnumber  => t8('Partnumber'),
    },
    with_objects => [ qw(unit_obj) ],
  );
}

1;
