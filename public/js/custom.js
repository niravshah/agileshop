(function ($) {


    $(document).ready(function () {



        var wd = 334;
        var ht = 498;

        var gutter = 20;
        var lm = 74;
        var tm = 75;

        var p0 = new fabric.Canvas('p0');
        p0.setBackgroundColor("#FFFFFF");


        var c2 = new fabric.Canvas('c2');
        c2.setBackgroundColor("#FFFFFF");

        renderScrumPointCanvases(wd, ht, lm, tm, gutter);


        var canvas = new fabric.Canvas('canvas');
        canvas.setBackgroundImage('/images/bg4.png', canvas.renderAll.bind(canvas));

        var text1 = new fabric.Text('Create Your Own Pack At', {
            fontSize: 12,
            top: 430,
            fontFamily: 'Roboto Condensed'
        });
        var text2 = new fabric.Text('myscrumcards.com', {
            fontSize: 16,
            top: 450,
            fontFamily: 'Roboto Condensed'
        });

        canvas.centerObjectH(text1);
        canvas.centerObjectH(text2);
        canvas.add(text1);
        canvas.add(text2);


        $("#imgInp").change(function () {
            readURL(this);
        });

        $("#download").click(function () {
            var pdf = new jsPDF("p", "px", "a4");
            var imgData = c2.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), '1', 'NONE', 0);

            pdf.addPage();
            var imgData2 = p0.toDataURL('image/png');
            pdf.addImage(imgData2, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), '2', 'NONE', 0);

            pdf.save('sample-file.pdf');
        });

        $("#toJson").click(function () {
            var json = p0.toJSON();
            console.log('P0 JSON' + json);
            var x0 = new fabric.Canvas('x0');
            x0.loadFromJSON(json, x0.renderAll.bind(x0))
        });

        function readURL(input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var logoImg = new Image();
                    logoImg.src = e.target.result;
                    logoImg.onload = function () {
                        var fabricImage = new fabric.Image(logoImg);
                        fabricImage.scaleToHeight(120);
                        canvas.centerObject(fabricImage);
                        canvas.add(fabricImage);
                        canvas.renderAll();


                        var i2 = new Image();
                        i2.src = canvas.toDataURL();

                        i2.onload = function () {

                            var e1 = new fabric.Image(i2, {top: tm, left: lm});
                            c2.add(e1);

                            var e2 = new fabric.Image(i2, {top: tm, left: lm + wd + gutter});
                            c2.add(e2);

                            var e3 = new fabric.Image(i2, {top: tm, left: lm + wd * 2 + gutter * 2});
                            c2.add(e3);

                            var e4 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm});
                            c2.add(e4);

                            var e5 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm + wd + gutter});
                            c2.add(e5);

                            var e6 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm + wd * 2 + gutter * 2});
                            c2.add(e6);

                            var e7 = new fabric.Image(i2, {top: tm + ht * 2 + gutter * 2, left: lm});
                            c2.add(e7);

                            var e8 = new fabric.Image(i2, {top: tm + ht * 2 + gutter * 2, left: lm + wd + gutter});
                            c2.add(e8);

                            var e9 = new fabric.Image(i2, {
                                top: tm + ht * 2 + gutter * 2,
                                left: lm + wd * 2 + gutter * 2
                            });
                            c2.add(e9);


                            c2.renderAll();
                        }
                    };
                };

                reader.readAsDataURL(input.files[0]);
            }
        }

        function renderScrumPointCanvases(wd, ht, lm, tm, gutter) {


            var canvas = new fabric.Canvas('p1');
            var font = new FontFaceObserver('Josefin Slab');
            font.load().then(function () {
                addCardToCanvas2(canvas, p0, '1/2', tm, lm, function () {
                    addCardToCanvas2(canvas, p0, '1', tm, lm + wd + gutter, function () {
                        addCardToCanvas2(canvas, p0, '2', tm, lm + wd * 2 + gutter * 2, function () {
                            addCardToCanvas2(canvas, p0, '3', tm + ht + gutter, lm, function () {
                                addCardToCanvas2(canvas, p0, '5', tm + ht + gutter, lm + wd + gutter, function () {
                                    addCardToCanvas2(canvas, p0, '8', tm + ht + gutter, lm + wd * 2 + gutter * 2, function () {
                                        addCardToCanvas2(canvas, p0, '13', tm + ht * 2 + gutter * 2, lm, function () {
                                            addCardToCanvas2(canvas, p0, '21', tm + ht * 2 + gutter * 2, lm + wd + gutter, function () {
                                                addCardToCanvas2(canvas, p0, 'B', tm + ht * 2 + gutter * 2, lm + wd * 2 + gutter * 2, function () {
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        })
                    })
                })
            })


        }


        function addCardToCanvas2(canvas, parent, points, tm, lm, callback) {

            canvas.clear();

            var website_name = new fabric.Text('myscrumcards.com', {
                fontSize: 14, top: 450, fontFamily: 'Roboto Condensed'
            });

            canvas.centerObjectH(website_name);
            canvas.add(website_name);


            if (points === 'B') {

                var img = new Image();
                img.src = '/images/coffee.png';
                img.onload = function (e) {
                    var break_i = new fabric.Image(img);
                    break_i.scaleToHeight(220);
                    canvas.centerObject(break_i);
                    canvas.add(break_i);
                    addBackgroundAndAddToParent(canvas, parent, tm, lm, callback)
                };

            } else {
                var p1_score = new fabric.Text(points, {
                    fontSize: 220,
                    fontFamily: 'Josefin Slab'
                });

                canvas.centerObject(p1_score);
                canvas.add(p1_score);
                addBackgroundAndAddToParent(canvas, parent, tm, lm, callback)
            }


        }

        function addBackgroundAndAddToParent(canvas, parent, tm, lm, callback) {
            canvas.setBackgroundImage('/images/bg5.png',
                function () {
                    var p1_img = new Image();
                    p1_img.src = canvas.toDataURL();
                    p1_img.onload = function () {
                        var p1_fab = new fabric.Image(p1_img, {top: tm, left: lm});
                        parent.add(p1_fab);
                        callback();
                    }
                }
            );
        }

    });

})(jQuery);