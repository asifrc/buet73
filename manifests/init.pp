# Bismillah

exec {'apt-update':
  command => "/usr/bin/apt-get update",
}

Exec['apt-update'] -> Package <| |>

class {'apache':
  docroot => '/vagrant',
  mpm_module => 'prefork',
}

class {'::apache::mod::php':
}

file {'/etc/php5/apache2/conf.d/asifandco.ini':
  require => Class['::apache::mod::php'],
  ensure  => present,
  source  => '/vagrant/etc/asifandco-php.ini',
}

class {'::mysql::server':
  root_password => 'devpassword',
  databases     => {
    'buet73dev' => {
      ensure    => present,
    }
  },
}

class {'::mongodb::server':
  ensure  => present,
  bind_ip => ['0.0.0.0'],
}

package {'nodejs-legacy':
  ensure => present,
}

package {'npm':
  ensure  => present,
}

file {'/usr/local/lib/node_modules':
  ensure => directory,
  owner  => 'vagrant',
  mode   => 777,
}
