var GunPeriodu = '30';

function LoadScreen(UserID, Gun) {

    GunPeriodu = Gun;

    $.ajax({
        url: 'getsearchresults.asmx/GetChartAylaraGoreMikroSiparislerKullaniciyaGore',
        data: "{ 'UserID': '" + UserID + "',Gun:'" + Gun + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccess_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });
    
    $.ajax({
    url: 'getsearchresults.asmx/NakitAkisi',
    data: "{ 'UserID': '" +UserID + "',Gun:'" +Gun + "'}",
    dataType: "json",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    success: OnSuccessNakitAkisi_,
    error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
    },
    failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
            }
    });


    $.ajax({
        url: 'getsearchresults.asmx/GetChartSatislaraGore',
        data: "{ 'UserID': '" + UserID + "',Gun:'" + Gun + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccessSatislar_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });

    $.ajax({
        url: 'getsearchresults.asmx/GetCharSatisciPastasi',
        data: "{ 'UserID': '" + UserID + "',Gun:'" + Gun + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccessPasta_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });

    $.ajax({
        url: 'getsearchresults.asmx/GetCharBolgePastasi',
        data: "{ 'UserID': '" + UserID + "',Gun:'" + Gun + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccessBolgePasta_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });


    $.ajax({
        url: 'getsearchresults.asmx/GetRiskler',
        data: "{ 'UserID': '" + UserID + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccessRiskler_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });

    $.ajax({
        url: 'getsearchresults.asmx/GetRiskliSirketler',
        data: "{ 'UserID': '" + UserID + "'}",
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: OnSuccessRiskliSirketler_,
        error: function (response) {
            //$("#TextError").val(response.responseText);
            alert(response.responseText);
        },
        failure: function (response) {
            //$("#TextError").val(response.responseText);
            alert('Failure');
        }
    });

}


function OnSuccess_(data) {
    var aData = data.d;
    var labels = [];
    var values = [];
    var colors = [];
    var kotas = [];

    $.each(aData, function (inx, val) {
        labels.push(val.label);
        values.push(eval(val.value));
        colors.push(val.color);
        kotas.push(val.kota);
    }
    );

    var Period = GunPeriodu;


    var Baslik = "XXX";

    
    if (Period == "30")
        Baslik = 'Aylara Göre Siparişler';
    else if (Period == "1")
        Baslik = 'Günlere Göre Siparişler';
    else if (Period == "7")
        Baslik = 'Haftalara Göre Siparişler';
    else if (Period == "90")
        Baslik = 'Çeyreklere Göre Siparişler';
    else if (Period == "365")
        Baslik = 'Yıllara Göre Siparişler';



    document.getElementById("divSiparisler").innerHTML = '&nbsp;';
    document.getElementById("divSiparisler").innerHTML = '<canvas id="ChartSiparisler" style="padding: 0;margin: auto;display: block; "> </canvas>  ';
    var ctxsiparisler = $("#ChartSiparisler").get(0).getContext("2d");

    new Chart(ctxsiparisler,
    {
        type: 'bar',
        data:
        {
            labels: labels,
            datasets:
            [
                  {
                      label: "Sipariş Toplamları",
                      backgroundColor: colors,
                      data: values
                  },
                  {
                      label: "Kota",
                      data: kotas,
                      type: 'line'
                  }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + '.000 TL ';
                            },
                            fontSize: 10
                        }

                    }
                ]
            },

            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: Baslik
            },
            plugins:
           {
               labels: [
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   },
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};

function OnSuccessNakitAkisi_(data) {

    var aData = data.d;

    var labels =[];
    var gelens =[];
    var gidens =[];
    var farks =[];
    var colors =[];
    

    $.each(aData, function (inx, val) {
        labels.push(val.label);
        gelens.push(eval(val.gelen));
        gidens.push(eval(val.giden));
        farks.push(eval(val.fark));
        colors.push(val.color);
    }
    );

    var Period = GunPeriodu;


    var Baslik = "XXX";


    if (Period == "30")
        Baslik = 'Aylara Göre Nakit Akışı';
        else if (Period == "1")
        Baslik = 'Günlere Göre Nakit Akışı';
        else if (Period == "7")
        Baslik = 'Haftalara Göre Nakit Akışı';
        else if(Period == "90")
        Baslik = 'Çeyreklere Göre Nakit Akışı';
        else if (Period == "365")
        Baslik = 'Yıllara Göre Nakit Akışı';

    
    document.getElementById("divNakitAkisi").innerHTML = '&nbsp;';
    document.getElementById("divNakitAkisi").innerHTML = '<canvas id="ChartNakitAkisi" style="padding: 0;margin: auto;display: block; "> </canvas>  ';
    var ctxnakitakisi = $("#ChartNakitAkisi").get(0).getContext("2d");

    new Chart(ctxnakitakisi,
        {
        type: 'bar',
            data:
            {
                    labels: labels,
                    datasets:
            [
            {
                        label: "Fark",
                            data: farks,
                                borderColor:"black",
                            stack: 'Stack 0',
                                type: 'line'
                          },

                    {
                        label: "Gelen",
                        type: 'bar',
                        stack: 'Stack 1',
                        backgroundColor: 'green',
                    data: gelens
                },
                {
                        label: "Giden",
                        type: 'bar',
                        stack: 'Stack 1',
                        backgroundColor: 'red',
                        data: gidens
                },

                          ]
                          },
                          options: {
                          scales: {
                              yAxes: [
                          {
                            ticks: { 
                            callback: function (label, index, labels) {
                                return label / 1000 + '.000 TL ';
                                },
                                        fontSize: 10
                        }

}
                ]
                },

                        responsive: true,
                legend: { 
                position: 'top',
                        display: false
                        },
                            title : {
                        display: true,
                        fontSize: 16,
                        text: Baslik
            },
                plugins:
                {
                    labels: [
                   {
    render: 'label',
        fontSize : 0,
        fontColor: 'gray',
                   },
    {
            render: 'label',
                           fontSize: 0,
                               fontColor: 'gray',
                   }

                   ]
                   },
                               animation: {
                           animateScale: true,
                               animateRotate: true
            }
            }
    });
    };

function OnSuccessSatislar_(data) {
    var aData = data.d;
    var labels = [];
    var values = [];
    var colors = [];
    var kotas = [];

    $.each(aData, function (inx, val) {
        labels.push(val.label);
        values.push(eval(val.value));
        colors.push(val.color);
        kotas.push(val.kota);
    }
    );
    var Period = GunPeriodu;
    var Baslik = "XXX";

    if (Period == "30")
        Baslik = 'Aylara Göre Kesilen Faturalar';
    else if (Period == "1")
        Baslik = 'Günlere Göre Kesilen Faturalar';
    else if (Period == "7")
        Baslik = 'Haftalara Göre Kesilen Faturalar';
    else if (Period == "90")
        Baslik = 'Çeyreklere Göre Kesilen Faturalar';
    else if (Period == "365")
        Baslik = 'Yıllara Göre Kesilen Faturalar';



    document.getElementById("divSatislar").innerHTML = '&nbsp;';
    document.getElementById("divSatislar").innerHTML = '<canvas id="ChartSatislar" style="padding: 0;margin: auto;display: block; "> </canvas>  ';
    var ctxsatislar = $("#ChartSatislar").get(0).getContext("2d");

    new Chart(ctxsatislar,
    {
        type: 'bar',
        data:
        {
            labels: labels,
            datasets:
            [
                  {
                      label: "Kesilen Faturalar",
                      backgroundColor: colors,
                      data: values
                  },
                  {
                      label: "Kota",
                      data: kotas,
                      type: 'line'
                  }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + '.000 TL ';
                            },
                            fontSize: 10
                        }

                    }
                ]
            },

            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: Baslik
            },
            plugins:
           {
               labels: [
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   },
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};



function OnSuccessRiskler_(data) {
    var aData = data.d;
    var isimler = [];
    var values = [];
    var colors = [];

    $.each(aData, function (inx, val) {
        isimler.push(val.isim);
        values.push(eval(val.deger));
        colors.push(val.color);
    }
    );

    var ctxriskler = $("#ChartRiskler").get(0).getContext("2d");

    new Chart(ctxriskler,
    {
        type: 'bar',
        data:
        {
            labels: isimler,
            datasets:
            [
                  {
                      label: "Riskler",
                      backgroundColor: colors,
                      data: values
                  }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + '.000 TL ';
                            },
                            fontSize: 8
                        }

                    }
                ]
            },

            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: 'Riskler'
            },
            plugins:
           {
               labels: [
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   },
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};

function OnSuccessRiskliSirketler_(data) {
    var aData = data.d;
    var isimler = [];
    var values = [];
    var colors = [];

    $.each(aData, function (inx, val) {
        isimler.push(val.isim);
        values.push(eval(val.deger));
        colors.push(val.color);
    }
    );

    var ctxrisklisirketler = $("#ChartRiskliSirketler").get(0).getContext("2d");

    new Chart(ctxrisklisirketler,
    {
        type: 'bar',
        data:
        {
            labels: isimler,
            datasets:
            [
                  {
                      label: "Riskli Müşteriler",
                      backgroundColor: colors,
                      data: values
                  }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function (label, index, labels) {
                                return label / 1000 + '.000 TL ';
                            },
                            fontSize: 8
                        }

                    }
                ]
            },

            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: 'Riskli Müşteriler'
            },
            plugins:
           {
               labels: [
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   },
                   {
                       render: 'label',
                       fontSize: 0,
                       fontColor: 'gray',
                   }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};


function OnSuccessPasta_(data) {
    var aData = data.d;
    var isimler = [];
    var values = [];
    var colors = [];

    $.each(aData, function (inx, val) {
        isimler.push(val.isim);
        values.push(eval(val.deger));
        colors.push(val.color);
    }
    );


    var Period = GunPeriodu;
    var Baslik = "XXX";

    if (Period == "30")
        Baslik = 'Müşteri Temsilcilerine Göre Bu Ayki Siparişler';
    else if (Period == "1")
        Baslik = 'Müşteri Temsilcilerine Göre Bugünkü Siparişler';
    else if (Period == "7")
        Baslik = 'Müşteri Temsilcilerine Göre Bu Haftaki Siparişler';
    else if (Period == "90")
        Baslik = 'Müşteri Temsilcilerine Göre Bu Çeyrekteki Siparişler';
    else if (Period == "365")
        Baslik = 'Müşteri Temsilcilerine Göre Bu Yılki Siparişler';


    document.getElementById("divSatiscilar").innerHTML = '&nbsp;';
    document.getElementById("divSatiscilar").innerHTML = '<canvas id="ChartSatiscilar" style="padding: 0;margin: auto;display: block; "> </canvas> ';

    var ctxsatiscilar = $("#ChartSatiscilar").get(0).getContext("2d");

    new Chart(ctxsatiscilar,
    {
        type: 'pie',
        data:
        {
            labels: isimler,
            datasets:
            [
                  {
                      label: "Müşteri Temsilcileri",
                      backgroundColor: colors,
                      data: values
                  }
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: Baslik
            },
            plugins:
           {
               labels:
               [
                       {
                           render: 'label',
                           fontColor: '#000',
                           position: 'outside',
                           fontSize: 12,
                           fontColor: 'gray',
                           fontFamily: 'Calibri',
                           showActualPercentages: true,
                           outsidePadding: 4,
                           textMargin: 4,
                           showZero: false
                       },
                       {
                           render: 'percantage',
                           fontColor: '#000',
                           position: 'inside',
                           fontFamily: 'Calibri',
                           fontSize: 12,
                           fontColor: 'black',
                           showActualPercentages: true,
                           outsidePadding: 4,
                           textMargin: 4,
                           showZero: false
                       }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};


function OnSuccessBolgePasta_(data) {
    var aData = data.d;
    var isimler = [];
    var values = [];
    var colors = [];

    $.each(aData, function (inx, val) {
        isimler.push(val.isim);
        values.push(eval(val.deger));
        colors.push(val.color);
    }
    );

    var Period = GunPeriodu;
    var Baslik = "XXX";

    if (Period == "30")
        Baslik = 'Bölgelere Göre Bu Ayki Siparişler';
    else if (Period == "1")
        Baslik = 'Bölgelere Göre Bugünkü Siparişler';
    else if (Period == "7")
        Baslik = 'Bölgelere  Göre Bu Haftaki Siparişler';
    else if (Period == "90")
        Baslik = 'Bölgelere  Göre Bu Çeyrekteki Siparişler';
    else if (Period == "365")
        Baslik = 'Bölgelere  Göre Bu Yılki Siparişler';


    document.getElementById("divBolgeler").innerHTML = '&nbsp;';
    document.getElementById("divBolgeler").innerHTML = '<canvas id="ChartBolgeler" style="padding: 0;margin: auto;display: block; "> </canvas> ';

    var ctxbolgeler = $("#ChartBolgeler").get(0).getContext("2d");

    new Chart(ctxbolgeler,
    {
        type: 'pie',
        data:
        {
            labels: isimler,
            datasets:
            [
                  {
                      label: "Bölgeler",
                      backgroundColor: colors,
                      data: values
                  }
            ]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: true,
                fontSize: 16,
                text: Baslik
            },
            plugins:
           {
               labels:
               [
                       {
                           render: 'label',
                           fontColor: '#000',
                           position: 'outside',
                           fontSize: 12,
                           fontColor: 'gray',
                           fontFamily: 'Calibri',
                           showActualPercentages: true,
                           outsidePadding: 4,
                           textMargin: 4,
                           showZero: false
                       },
                       {
                           render: 'percantage',
                           fontColor: '#000',
                           position: 'inside',
                           fontFamily: 'Calibri',
                           fontSize: 12,
                           fontColor: 'black',
                           showActualPercentages: true,
                           outsidePadding: 4,
                           textMargin: 4,
                           showZero: false
                       }

               ]
           },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};
