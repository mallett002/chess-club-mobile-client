export function getInviteCreationError(error) {
  if (/player with username [^\s\\]+ not found/.test(error)) {
    return 'Invitation failed! Make sure username is correct.';
  } else if (/player attempting to invite self/.test(error)) {
    return "You can't invite yourself!";
  } else if (/Existing invitation with [^\s\\]+/.test(error)) {
    return "You have an existing invitation with that player!";
  } else {
    return 'Something went wrong. Please try again.';
  }
}