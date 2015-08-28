// Router

Router.configure({
  loadingTemplate: 'loading'
});

// Auth route
// DOMAIN.TLD/oauth/auth?response_type=token&client_id=CLIENT_ID&redirect_uri=REDIRECT_URI&scope=SCOPES
Router.route('auth', {
  path: '/oauth/auth',
  name: 'auth',
  template: 'auth',
  layoutTemplate: 'layout',
  data: function() {
    return Clients.findOne(Session.get('auth').client_id);
  },
  waitOn: function() {
    // Saves request variables to session
    if(this.params.query.client_id) {
      var response_type   = this.params.query.response_type;
      var client_id       = this.params.query.client_id;
      //var redirect_uri  = this.params.query.redirect_uri;
      //var scope         = this.params.query.scope;
      Session.set('auth', {
        response_type: response_type,
        client_id: client_id,
        //redirect_uri: redirect_uri,
        //scope: scope
      });
    } else if(!Session.get('auth')) {
      this.render("auth_error");
    }

    // Check if user is logged in.
    if(!Meteor.userId()) {
      Router.go('signin');
    } else {
      return [
        Meteor.subscribe('Client', Session.get('auth').client_id),
        Meteor.subscribe('authCodes')
      ];
    }
  }
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/login',
  template: 'login',
  layoutTemplate: 'layout'
});

// Other

/*Router.route('home', {
  path: '/',
  name: 'home',
  template: 'home'
});*/

// Unused
Router.route('register', {
  path: '/oauth/register',
  template: 'register',
  layoutTemplate: 'layout'
});

Router.route('admin', {
  path: '/oauth/admin',
  template: 'admin',
  layoutTemplate: 'layout'
});
