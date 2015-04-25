module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: ['src/app.js'],
                dest: 'demo/js/app.bundle.js',
                options: {
                    browserifyOptions: {
                        standalone: 'APP',
                        entry: 'src/app.js',
                        debug: true
                    },
                    transform: [
                        'babelify',
                        [ 'detachkify', {
                            relativeTo: __dirname + "/src"
                        }]
                    ],
                    watch: true,
                    postBundleCB: function (err, src, next) {
                        if (err) {
                            throw err;
                        }
                        var through = require('through');
                        var stream = through().pause().queue(src).end();
                        var buffer = '';

                        stream.pipe(require('mold-source-map').transformSourcesRelativeTo(__dirname + '/demo/js')).pipe(through(function (chunk) {
                            buffer += chunk.toString();
                        }, function () {
                            next(err, buffer);
                        }));
                        stream.resume();
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 5555,
                    base: 'demo',
                    middleware: function (connect) {
                        var modRewrite = require('connect-modrewrite');
                        return [
                            modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.eot|\\.woff|\\.woff2$ /index.html [L]']),
                            connect['static']('demo')
                        ];
                    }
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src/',
                    outdir: 'docs/'
                }
            }
        },
        eslint: {
            target: ['src/**/*.js']
        },
        injector: {
            options: {
                template: "template.html",
                destFile: "demo/index.html",
                ignorePath: 'demo/',
                addRootSlash: false
            },
            local_dependencies: {
                files: {
                    'demo/index.html': [
                        'demo/css/bower.bundle.css',
                        'demo/js/bower.bundle.js',
                        'demo/js/app.bundle.js'
                    ]
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'demo/js/bower.bundle.js',
                cssDest: 'demo/css/bower.bundle.css'
            }
        },
        bower: {
            fonts: {
                dest: 'demo/',
                fonts_dest: 'demo/',
                skipPatterns: [
                    /^.*\.js$/i,
                    /^.*\.css$/i
                ],
                options: {
                    keepExpandedHierarchy: true
                }
            }
        },
        copy: {
            assets: {
                files: [
                    {expand: true, cwd: 'assets/', src: ['**'], dest: 'demo/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-bower');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('deploy', ['browserify', 'bower_concat', 'injector', 'bower:fonts', 'copy:assets']);
    grunt.registerTask('dev', ['eslint', 'browserify', 'bower_concat', 'injector', 'bower:fonts', 'copy:assets', 'connect:server:keepalive']);
};
