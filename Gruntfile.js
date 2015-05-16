module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: ['src/app.js'],
                dest: 'compiled/js/app.bundle.js',
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

                        stream.pipe(require('mold-source-map').transformSourcesRelativeTo(__dirname + '/compiled/js')).pipe(through(function (chunk) {
                            buffer += chunk.toString();
                        }, function () {
                            next(err, buffer);
                        }));
                        stream.resume();
                    }
                }
            },
            prod: {
                src: ['src/app.js'],
                dest: 'compiled/js/app.bundle.js',
                options: {
                    browserifyOptions: {
                        standalone: 'APP',
                        entry: 'src/app.js'
                    },
                    transform: [
                        'babelify',
                        [ 'detachkify', {
                            relativeTo: __dirname + "/src"
                        }]
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 5555,
                    base: 'compiled',
                    middleware: function (connect) {
                        var modRewrite = require('connect-modrewrite');
                        return [
                            modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.eot|\\.woff|\\.woff2$ /index.html [L]']),
                            connect['static']('compiled')
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
                destFile: "compiled/index.html",
                ignorePath: 'compiled/',
                addRootSlash: true
            },
            local_dependencies: {
                files: {
                    'compiled/index.html': [
                        'compiled/css/bower.bundle.css',
                        'compiled/js/bower.bundle.js',
                        'compiled/js/app.bundle.js'
                    ]
                }
            }
        },
        bower_concat: {
            all: {
                dest: 'compiled/js/bower.bundle.js',
                cssDest: 'compiled/css/bower.bundle.css'
            }
        },
        bower: {
            fonts: {
                dest: 'compiled/',
                fonts_dest: 'compiled/',
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
                    {expand: true, cwd: 'assets/', src: ['**'], dest: 'compiled/'}
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
    grunt.registerTask('dev', ['eslint', 'browserify:app', 'bower_concat', 'injector', 'bower:fonts', 'copy:assets', 'connect:server:keepalive']);
    grunt.registerTask('prod', ['eslint', 'browserify:prod', 'bower_concat', 'injector', 'bower:fonts', 'copy:assets', 'connect:server:keepalive']);
};
