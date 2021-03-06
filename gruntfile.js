module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    clean: {
      folder: "dist/"
    },
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "./src/public",
            src: ["**"],
            dest: "./dist/public"
          },
          {
            expand: true,
            cwd: "./src/views",
            src: ["**"],
            dest: "./dist/views"
          }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      views: {
        files: ["views/**/*.pug"],
        tasks: ["copy"]
      },
        options: {
            dateFormat: function(time) {
                grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
                grunt.log.writeln('I am now watching any change...');
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "clean",
    "copy",
    "ts",
    "watch"
  ]);

};