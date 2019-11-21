{ pkgs ? import ./pkgs.nix {} }:

with pkgs;

let
  dnaConfig = dna: {
    id = dna.name;
    file = "${dna}/${dna.name}.dna.json";
    hash = dnaHash dna;
  };

  instanceConfig = dna: {
    agent = "holo-monitor-agent";
    dna = dna.name;
    id = dna.name;
    storage = {
      path = ".holochain/holo/storage/${dna.name}";
      type = "file";
    };
  };

  dnas = with dnaPackages; [
    holo-hosting-app
  ];
in

{
  holo-monitor = stdenv.mkDerivation rec {
    name = "holo-monitor";
    src = gitignoreSource ./.;

    nativeBuildInputs = [
      holochain-cli
      holochain-conductor
      nodejs-12_x
    ];

    preConfigure = ''
      cp -r ${npmToNix { inherit src; }} node_modules
      chmod -R +w node_modules
      patchShebangs node_modules
    '';

    installPhase = ''
      mkdir $out
      mv * $out
    '';
  };

  holo-monitor-conductor-config = writeTOML {
    bridges = [];
    persistence_dir = ".holochain/holo";
    agents = [{
      id = "holo-monitor-agent";
      name = "Holo Monitor";
      keystore_file = "agent.key";
      public_address = "HcSCiNEDE7zGesteidU3Teckx9D5oqu5q96G99qyMJgYsqgrHIK9w8wGAEcvqtr";
    }];
    dnas = map dnaConfig dnas;
    instances = map instanceConfig dnas;
    interfaces = [
      {
        driver = {
          port = 8800;
          type = "websocket";
        };
        id = "master-interface";
        instances = map (dna: { id = dna.name; }) dnas;
      }
      {
        admin = true;
        id = "public-interface";
        driver = {
          port = 8080;
          type = "http";
        };
      }
    ];
    logger = {
      type = "debug";
      rules.rules = [
        {
          color = "red";
          exclude = false;
          pattern = "^err/";
        }
        {
          color = "white";
          exclude = false;
          pattern = "^debug/dna";
        }
      ];
    };
  };
}
