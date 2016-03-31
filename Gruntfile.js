'use strict';
module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //清除目录
    clean:{
      build:['build','.build'],
    },
    htmlhint:{
      build:{
        options:{
          "tag-pair":true,
          "tagname-lowercase":true,
          "attr-lowercase":true,
          "attr-value-double-quotes":true,
          "doctype-first":true,
          "spec-char-escape":true,
          "id-unique":true,
          "head-script-disabled":true,
          "style-disabled":true
        },
        src:["build/index.html"]
      }
    },
    //js语法验证
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      options: {
        force:true,
        jshintrc:'jshintrc'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      lib: {
        options:{
          mangle:false,//不混淆变量名
        },
        files: [{
          expand:true,
          cwd:'src/lib',
          src:['**/*.js'],
          dest:'build/lib/'
        }]
      },
      build: {
        options:{
          mangle:true,//不混淆变量名
        },
        files: [{
          expand:true,
          cwd:'src/js',
          src:['**/*.js'],
          dest:'build/js/'
        }]
      }
    },
    //复制未处理的静态资源文件
    copy:{
      main:{ 
        expand: true,
          cwd: 'src/',
          src: ['!slice/*','!test/*','**/*'],
          dest: 'build/'
      }
    },
    imagemin:{
      dynamic: {
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/images',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'build/images'                  // Destination path prefix
        }]
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      minify: {
        expand: true,
        cwd: 'build/css',
        src: ['**/*.css', '!*.min.css'],
        dest: 'build/css',
        ext: '.css'
      }
    },
    adisprite: {
      all: {
        srcCss: 'src/css',
        srcImg: 'src/slice',
        destCss: 'build/css',
        destImg: 'build/images/sprite',
        'algorithm': 'binary-tree',
        'engine': 'gm',
        'exportOpts': {
          'format': 'png',
          'quality': 90
        }
      }
    },
    //替换时间戳，防止静态资源的缓存
    replace: {
        dist: {
          options: {
            patterns: [
              {
                match: 'timestamp',
                replacement: '<%= new Date().getTime() %>'
              }
            ]
          },
          files: [
            {expand: true, cwd:'src/', src: ['**/*.html'], dest: 'build/'}
          ]
        }
    },
    //自动刷新
    watch: {
      all: {
        cwd:'src/',
        options: { livereload:true},
        files: ['**/*.html','**/*.css','**/*.js']
      },
    }


  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // 加载提供"uglify"任务的插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-sprite');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-adisprite');
  grunt.loadNpmTasks('grunt-replace');
  // 默认任务
  grunt.registerTask('build', [
    "clean",
    "copy",
    "htmlhint",
/*    "transport",*/
   "jshint",
    //"adisprite",
    "cssmin",
    "imagemin",
    "uglify",
    "replace"
  ]);

  grunt.registerTask('live',["watch"])
}