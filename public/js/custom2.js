(function ($) {
    $(document).ready(function () {

        var wd = 334;
        var ht = 498;

        var gutter = 20;
        var lm = 74;
        var tm = 75;


        var n1Canvas = new fabric.Canvas('n1');
        var dCanvas = new fabric.Canvas('n0');

        var bgSrc = {'bg1': '/images/bg4_alt.png', 'bg2': '/images/bg6.png'};
        var pCanvasBgSrc = {'bg1': '/images/bg5_alt.png', 'bg2': '/images/bg6.png'};

        var dCanvasBg = bgSrc['bg1'];
        var dCanvasLogo = '/images/logo_temp.png';

        var pCanvasBg = pCanvasBgSrc['bg1'];

        var website_name = 'AgileShop.com';

        $(':checkbox').radiocheck();

        $('#slide2').hide();
        $('#checkout').hide();
        $('#freeCheckout').hide();
        $('#removeBrandingCheckout').hide();
        $('#professionalPrintCheckout').hide();

        renderDisplayCanvas(dCanvas, dCanvasBg, dCanvasLogo);

        $('.slick-carousel').slick({
            autoplay: true,
            autoplaySpeed: 2000,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1
        });

        $('#logoUpload').change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#generateDeck').show();
                    dCanvasLogo = e.target.result;
                    renderDisplayCanvas(dCanvas, dCanvasBg, dCanvasLogo);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        $(".dropdown-menu li a").click(function () {
            $(".dropbtn:first-child").text($(this).text());
            $(".dropbtn:first-child").val($(this).text());
            dCanvasBg = bgSrc[$(this).attr('id')];
            renderDisplayCanvas(dCanvas, dCanvasBg, dCanvasLogo);
        });

        $('#customizeDeck').click(function (e) {
            $('#slide2').hide();
            $('#slide1').show();
            renderDisplayCanvas(dCanvas, dCanvasBg, dCanvasLogo);
        });

        $('#generateDeck').click(function (e) {
            $('#slide1').hide();
            $('#slide2').show();
            generateDeck(false);
        });

        $('#showSlide2').click(function (e) {
            $('#slide1').hide();
            $('#checkout').hide();
            $('#slide2').show();
        });

        $('#downloadDeck').click(function (e) {
            $('#slide2').hide();
            $('#checkout').show();
            $('#freeCheckout').show();
            $('#removeBrandingCheckout').hide();
            $('#professionalPrintCheckout').hide();
        });

        $('#removeBranding').click(function (e) {
            generateDeck(true);
            $('#slide2').hide();
            $('#checkout').show();
            $('#freeCheckout').hide();
            $('#professionalPrintCheckout').hide();
            $('#removeBrandingCheckout').show();
        });

        $('#orderProfessionalPrints').click(function (e) {
            generateDeck(true);
            $('#slide2').hide();
            $('#checkout').show();
            $('#freeCheckout').hide();
            $('#removeBrandingCheckout').hide();
            $('#professionalPrintCheckout').show();
            createStripeCheckoutForm();

        });

        $("form[name='freeCheckoutForm']").validate({
            rules: {
                downloadEmailInput: {
                    required: true,
                    email: true
                }
            },
            messages: {
                downloadEmailInput: "Please enter a valid email address"
            },
            submitHandler: function (form) {
                $('#downloadEmailInputContainer').addClass('has-success');
                var canvas = new fabric.Canvas('n2');
                var canvas2 = new fabric.Canvas('n3');
                async.parallel([function (callback) {
                    generateBackPanelPrintCanvas(canvas, callback);
                }, function (callback) {
                    generateFrontPanelPrintCanvas(canvas2, callback);
                }], function (err, results) {
                    console.log('downloadDeck', err, results);
                    createPdf([canvas, canvas2], "sample-file.pdf")
                });
            }
        });

        function generateDeck(noBranding) {

            async.series([
                    function (callback) {
                        generateBackPanel(n1Canvas, dCanvasBg, dCanvasLogo, noBranding, function () {
                            callback(null, 'back');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '1/2', noBranding, function () {
                            callback(null, 'half');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '1', noBranding, function () {
                            callback(null, 'one');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '2', noBranding, function () {
                            callback(null, 'two');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '3', noBranding, function () {
                            callback(null, 'three');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '5', noBranding, function () {
                            callback(null, 'five');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '8', noBranding, function () {
                            callback(null, 'eight');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '13', noBranding, function () {
                            callback(null, 'thirteen');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, '21', noBranding, function () {
                            callback(null, 'twentyone');
                        });
                    },
                    function (callback) {
                        generatePointSlide(n1Canvas, dCanvasLogo, 'B', noBranding, function () {
                            callback(null, 'break');
                        });
                    }
                ],
                function (err, results) {
                    console.log('generateDeck Async Series End', err, results);
                });

        }

        function createPdf(canvases, fileName) {

            var pdf = new jsPDF("p", "px", "a4");
            var counter = 0;

            async.each(canvases, function (canvas, cb) {

                if (counter != 0) {
                    pdf.addPage();
                }
                var imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), counter, 'NONE', 0);
                counter = counter + 1;
                cb();

            }, function (err, results) {
                console.log("createPdf asyncjs", err, results);
                pdf.save(fileName);
            })
        }

        function generateBackPanel(canvas, bg, logo, noBranding, callback) {
            canvas.clear();
            canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
            if (!noBranding) {
                var text1 = new fabric.Text('Create Your Own Pack At', {
                    fontSize: 12,
                    top: 430,
                    fontFamily: 'Roboto Condensed'
                });
                var text2 = new fabric.Text(website_name, {
                    fontSize: 16,
                    top: 450,
                    fontFamily: 'Roboto Condensed'
                });
                canvas.centerObjectH(text1);
                canvas.centerObjectH(text2);
                canvas.add(text1);
                canvas.add(text2);
            }
            var logoImg = new Image();
            logoImg.src = logo;
            logoImg.onload = function () {

                var fabricImage = new fabric.Image(logoImg);
                var maxWidth = 240;
                if (fabricImage.width > maxWidth) {
                    var heightRatio = fabricImage.height / fabricImage.width;
                    fabricImage.scaleToWidth(maxWidth);
                    fabricImage.scaleToHeight(maxWidth * heightRatio);
                }

                canvas.centerObject(fabricImage);
                canvas.add(fabricImage);
                canvas.renderAll();
                addSlideToSlick('pointSlide' + 'Back', canvas);
                addSlideToDownloadPage(canvas);
                callback();
            }
        }

        function generatePointSlide(canvas, logo, points, noBranding, callback) {

            var logoTop = 450;
            canvas.clear();

            if (!noBranding) {
                var wname = new fabric.Text(website_name, {
                    fontSize: 14, top: 450, fontFamily: 'Roboto Condensed'
                });
                canvas.centerObjectH(wname);
                canvas.add(wname);
                logoTop = 380;
            }

            var logoImg = new Image();
            logoImg.src = logo;
            logoImg.onload = function () {
                var fabricImage = new fabric.Image(logoImg, {top: logoTop});
                var maxHeight = 60;

                if (fabricImage.height > maxHeight) {
                    var widthRatio = fabricImage.width / fabricImage.height;
                    fabricImage.scaleToWidth(maxHeight * widthRatio);
                    fabricImage.scaleToHeight(maxHeight);
                }

                canvas.centerObjectH(fabricImage);
                canvas.add(fabricImage);

                if (points === 'B') {
                    var img = new Image();
                    img.src = '/images/coffee.png';
                    img.onload = function (e) {
                        var break_i = new fabric.Image(img);
                        break_i.scaleToHeight(220);
                        canvas.centerObject(break_i);
                        canvas.add(break_i);
                        canvas.setBackgroundImage(pCanvasBg,
                            function () {
                                addSlideToSlick('pointSlide' + points, canvas);
                                callback();
                            }
                        );
                    };
                } else {
                    var p1_score = new fabric.Text(points, {
                        fontSize: 220,
                        fontFamily: 'Josefin Slab'
                    });
                    canvas.centerObject(p1_score);
                    canvas.add(p1_score);
                    canvas.setBackgroundImage(pCanvasBg,
                        function () {
                            if (points === '1/2') {
                                addSlideToSlick('pointSlideHalf', canvas);
                            } else {
                                addSlideToSlick('pointSlide' + points, canvas);
                            }
                            callback();
                        }
                    );
                }

            }


        }

        function generateBackPanelPrintCanvas(canvas, cb) {
            canvas.clear();
            var i2 = new Image();
            i2.src = $('#pointSlideBack').attr('src');
            i2.onload = function () {

                addGridLines(canvas);

                var e1 = new fabric.Image(i2, {top: tm, left: lm});
                canvas.add(e1);

                var e2 = new fabric.Image(i2, {top: tm, left: lm + wd + gutter});
                canvas.add(e2);

                var e3 = new fabric.Image(i2, {top: tm, left: lm + wd * 2 + gutter * 2});
                canvas.add(e3);

                var e4 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm});
                canvas.add(e4);

                var e5 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm + wd + gutter});
                canvas.add(e5);

                var e6 = new fabric.Image(i2, {top: tm + ht + gutter, left: lm + wd * 2 + gutter * 2});
                canvas.add(e6);

                var e7 = new fabric.Image(i2, {top: tm + ht * 2 + gutter * 2, left: lm});
                canvas.add(e7);

                var e8 = new fabric.Image(i2, {top: tm + ht * 2 + gutter * 2, left: lm + wd + gutter});
                canvas.add(e8);

                var e9 = new fabric.Image(i2, {
                    top: tm + ht * 2 + gutter * 2,
                    left: lm + wd * 2 + gutter * 2
                });
                canvas.add(e9);

                canvas.renderAll();
                cb(null, 'generateBackPanelPrintCanvas');
            }
        }

        function generateFrontPanelPrintCanvas(canvas, cb) {
            canvas.clear();

            addGridLines(canvas);
            async.series([
                    function (callback) {
                        addImageToCanvas(canvas, '#pointSlideHalf', tm, lm, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide1', tm, lm + wd + gutter, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide2', tm, lm + wd * 2 + gutter * 2, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide3', tm + ht + gutter, lm, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide5', tm + ht + gutter, lm + wd + gutter, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide8', tm + ht + gutter, lm + wd * 2 + gutter * 2, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlide13', tm + ht * 2 + gutter * 2, lm, callback);
                    },
                    function (callback) {
                        addImageToCanvas(canvas, '#pointSlide21', tm + ht * 2 + gutter * 2, lm + wd + gutter, callback);
                    }, function (callback) {
                        addImageToCanvas(canvas, '#pointSlideB', tm + ht * 2 + gutter * 2, lm + wd * 2 + gutter * 2, callback);
                    }],
                function (err, results) {
                    console.log('generateFrontPanelPrintCanvas Async Series End', err, results)
                    cb(null, 'generateFrontPanelPrintCanvas');
                });
        }

        function addGridLines(canvas) {
            var lPs = {
                strokeWidth: 0.3,
                stroke: 'red'
            };

            var line1 = new fabric.Line([lm, 0, lm, canvas.height], lPs);
            canvas.add(line1);

            var line2 = new fabric.Line([lm + wd, 0, lm + wd, canvas.height], lPs);
            canvas.add(line2);

            var line3 = new fabric.Line([lm + wd + gutter, 0, lm + wd + gutter, canvas.height], lPs);
            canvas.add(line3);

            var line4 = new fabric.Line([lm + wd * 2 + gutter, 0, lm + wd * 2 + gutter, canvas.height], lPs);
            canvas.add(line4);

            var line5 = new fabric.Line([lm + wd * 2 + gutter * 2, 0, lm + wd * 2 + gutter * 2, canvas.height], lPs);
            canvas.add(line5);

            var line6 = new fabric.Line([lm + wd * 3 + gutter * 2, 0, lm + wd * 3 + gutter * 2, canvas.height], lPs);
            canvas.add(line6);

            var line7 = new fabric.Line([0, tm, canvas.width, tm], lPs);
            canvas.add(line7);

            var line8 = new fabric.Line([0, tm + ht, canvas.width, tm + ht], lPs);
            canvas.add(line8);

            var line9 = new fabric.Line([0, tm + ht + gutter, canvas.width, tm + ht + gutter], lPs);
            canvas.add(line9);

            var line10 = new fabric.Line([0, tm + ht * 2 + gutter, canvas.width, tm + ht * 2 + gutter], lPs);
            canvas.add(line10);

            var line11 = new fabric.Line([0, tm + ht * 2 + gutter * 2, canvas.width, tm + ht * 2 + gutter * 2], lPs);
            canvas.add(line11);

            var line12 = new fabric.Line([0, tm + ht * 3 + gutter * 2, canvas.width, tm + ht * 3 + gutter * 2], lPs);
            canvas.add(line12);
        }

        function addSlideToSlick(id, canvas) {
            $('.slick-carousel').slick('slickAdd', '<div><img id=' + id + '></div></div>');
            $('#' + id).attr('src', canvas.toDataURL());
        }

        function addSlideToDownloadPage(canvas) {
            $('#downloadImg').append('<img id=downloadPageImg12>');
            $('#downloadPageImg12').attr('src', canvas.toDataURL());
        }

        function addImageToCanvas(canvas, imgRef, tm, lm, cb) {
            var i2 = new Image();
            i2.src = $(imgRef).attr('src');
            i2.onload = function () {
                var e1 = new fabric.Image(i2, {top: tm, left: lm});
                canvas.add(e1);
                cb(null, imgRef);
            }
        }

        function renderDisplayCanvas(canvas, bg, logoSrc) {
            canvas.clear();
            canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
            var text1 = new fabric.Text('Create Your Own Pack At', {
                fontSize: 12,
                top: 430,
                fontFamily: 'Roboto Condensed',
                editable: false,
                selectable: false
            });
            var text2 = new fabric.Text(website_name, {
                fontSize: 16,
                top: 450,
                fontFamily: 'Roboto Condensed',
                editable: false,
                selectable: false
            });
            canvas.centerObjectH(text1);
            canvas.centerObjectH(text2);
            canvas.add(text1);
            canvas.add(text2);

            var logoImg = new Image();
            logoImg.src = logoSrc;
            logoImg.onload = function () {
                var fabricImage = new fabric.Image(logoImg, {
                    editable: false,
                    selectable: false
                });
                var maxWidth = 240;
                if (fabricImage.width > maxWidth) {
                    var heightRatio = fabricImage.height / fabricImage.width;
                    fabricImage.scaleToWidth(maxWidth);
                    fabricImage.scaleToHeight(maxWidth * heightRatio);
                }
                canvas.centerObject(fabricImage);
                canvas.add(fabricImage);
            }
        }

        function createStripeCheckoutForm() {

            var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
            var elements = stripe.elements();

            var style = {
                base: {
                    fontSize: '16px',
                    color: "#32325d",
                }
            };

            var card = elements.create('card', {style: style});
            card.mount('#card-element');

            card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            var form = document.getElementById('payment-form');
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                stripe.createToken(card).then(function (result) {
                    if (result.error) {
                        // Inform the customer that there was an error.
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        // Send the token to your server.
                        stripeTokenHandler(result.token);
                    }
                });
            });
        }

        function stripeTokenHandler(token) {
            // Insert the token ID into the form so it gets submitted to the server
            var form = document.getElementById('payment-form');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', token.id);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();
        }

    });
})(jQuery);