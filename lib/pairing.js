(function(window) {
	var Pairing = {
		start: function()
		{
			var keys = localStorage['pairing_keys'];
			if(!keys)
			{
				var keys = tcrypt.asym_old.generate_ecc_keys();
				var keys = JSON.stringify({
					public: tcrypt.key_to_string(keys.public),
					private: tcrypt.key_to_string(keys.private)
				});
				localStorage['pairing_keys'] = keys;
			}

			try
			{
				keys = JSON.parse(keys);
			}
			catch(e)
			{
				delete localStorage['pairing_keys'];
				Pairing.start();
			}

			// skip popping up if the pairing popup is already open
			if(Popup.last_dispatch == 'pair' && Popup.win) return false;

			Popup.open({
				skip_login: true,
				dispatch: 'pair',
				public_key: keys.public
			});
		},

		get_keys: function(options)
		{
			options || (options = {});
			var keys = localStorage['pairing_keys'];
			if(options.binary)
			{
				keys = JSON.parse(keys);
				keys.public = tcrypt.key_to_bin(keys.public);
				keys.private = tcrypt.key_to_bin(keys.private);
			}
			return keys;
		},

		have_keys: function()
		{
			return !!Pairing.get_keys();
		}
	};

	window.Pairing = Pairing;
})(window);
