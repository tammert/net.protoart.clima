run:
	homey app run

validate:
	homey app validate

build:
	homey app build

install:
	homey app install

publish:
	if grep -q "production" env.json; then homey app publish; else echo "ENV not on 'production'"; fi

update_dependencies:
	npm update --save
