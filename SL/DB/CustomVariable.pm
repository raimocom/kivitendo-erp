# This file has been auto-generated only because it didn't exist.
# Feel free to modify it at will; it will not be overwritten automatically.

package SL::DB::CustomVariable;

use strict;
use SL::DB::MetaSetup::CustomVariable;

__PACKAGE__->meta->initialize;

# Creates get_all, get_all_count, get_all_iterator, delete_all and update_all.
__PACKAGE__->meta->make_manager_class;

sub value {
  my $self = $_[0];
  my $type = $self->config->type;

  goto &bool_value      if $type eq 'boolean';
  goto &timestamp_value if $type eq 'timestamp';
  goto &number_value    if $type eq 'number';

  if ( $_[1] && ($type eq 'customer' || $type eq 'vendor' || $type eq 'part') ) {
    $self->number_value($_[1]);
  }

  if ( $type eq 'customer' ) {
    require SL::DB::Customer;

    my $id = int($self->number_value);
    return $id ? SL::DB::Customer->new(id => $id)->load() : 0;
  } elsif ( $type eq 'vendor' ) {
    require SL::DB::Vendor;

    my $id = int($self->number_value);
    return $id ? SL::DB::Vendor->new(id => $id)->load() : 0;
  } elsif ( $type eq 'part' ) {
    require SL::DB::Part;

    my $id = int($self->number_value);
    return $id ? SL::DB::Part->new(id => $id)->load() : 0;
  }

  goto &text_value; # text, textfield, date and select
}

sub value_as_text {
  my $self = $_[0];
  my $type = $self->config->type;

  die 'not an accessor' if @_ > 1;

  if ($type eq 'boolean') {
    return $self->bool_value ? $::locale->text('Yes') : $::locale->text('No');
  } elsif ($type eq 'timestamp') {
    return $::locale->reformat_date( { dateformat => 'yy-mm-dd' }, $self->timestamp_value->ymd, $::myconfig{dateformat});
  } elsif ($type eq 'number') {
    return $::form->format_amount(\%::myconfig, $self->number_value, $self->config->processed_options->{PRECISION});
  } elsif ( $type eq 'customer' ) {
    require SL::DB::Customer;

    my $id = int($self->number_value);
    my $customer =  $id ? SL::DB::Customer->new(id => $id)->load() : 0;
    return $customer ? $customer->name : '';
  } elsif ( $type eq 'vendor' ) {
    require SL::DB::Vendor;

    my $id = int($self->number_value);
    return $id ? SL::DB::Vendor->new(id => $id)->load() : 0;
  } elsif ( $type eq 'part' ) {
    require SL::DB::Part;

    my $id = int($self->number_value);
    my $part = $id ? SL::DB::Part->new(id => $id)->load() : 0;
    return $part ? $part->description : '';
  }

  goto &text_value; # text, textfield, date and select
}

sub is_valid {
  my ($self) = @_;

  require SL::DB::CustomVariableValidity;

  my $query = [config_id => $self->config_id, trans_id => $self->trans_id];
  return SL::DB::Manager::CustomVariableValidity->get_all_count(query => $query) == 0;
}

1;
