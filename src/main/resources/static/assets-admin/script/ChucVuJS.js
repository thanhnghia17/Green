$(document).ready(function() {
    async function getAllChucVu() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/api/chuc-vu',
                method: 'GET',
                success: function(response) {
                    console.log(response);
                    var chucVuContainer = $('#tableChucVu tbody');
                    chucVuContainer.empty();
                    response.forEach(function(data) {
                        var row = $('<tr>');
                        row.append(`<td>${data.maChucVu}</td>`);
                        row.append(`<td>${data.tenChucVu}</td>`);
                        row.append(`<td>${data.mieuTa}</td>`);
                        row.append('<td>' +
                            '<a href="/Admin/Chức-vụ?maCV=' + data.maChucVu + '" class="btn btn-sm btn-primary">Sửa</a>\n' +
                            '<btn class="btn btn-sm btn-danger deleteChucVu">Xóa</btn>\n' +
                            '</td>');
                        row.append('</tr>');
                        chucVuContainer.append(row);
                        $('.deleteChucVu').click(function(){
                            var maCV = $(this).parent().parent().find('td:first-child').text();
                            if(confirm('Bạn có chắc muốn xóa chức vụ này?')) {
                                deleteChucVu(maCV).then(function(response) {
                                    alert('Xóa thành công!');
                                    getAllChucVu();
                                }).catch(function(error) {
                                    alert('Xóa thất bại!');
                                });
                            }
                        })
                    });
                    resolve(response);
                },
                error: function(error) {
                    console.error('Error fetching positions:', error);
                    reject(error);
                }
            });
        });
    }

    async function deleteChucVu(maCV) {
        return new Promise((resolve, reject)=>
            $.ajax({
                url: '/api/chuc-vu/delete?maCV=' + maCV,
                method: 'DELETE',
                success: function(response) {
                    console.log(response);
                    resolve(response);
                },
                error: function(error) {
                    console.error('Error deleting ChucVu:', error);
                    reject(error);
                }
            })
        )
    }

    async function getOneChucVu()  {
        try {
            var chucVu =  window.location.href;
            var url =  new URL(currentURL);
            var manv =  url.searchParams.get("maCV");
            const response = await $.ajax({
                url: '/api/chuc-vu/one?maCV=',
                method: 'GET'
            });
            alert(response)
        }catch (error) {
            // Handle errors here
            console.error('Error fetching ChucVu:', error);
        }


    }

    async function addChucVu() {
        try {
            const tenChucVu = $('#tenChucVu').val();
            const descChucVu = $('#descChucVu').val();
            const data = {
                tenChucVu: tenChucVu,
                mieuTa: descChucVu,
            };

            await $.ajax({
                url: '/api/chuc-vu/add',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
            });
            $('#tenChucVu').val("");
            $('#descChucVu').val("");
            await getAllChucVu();
            $('#btnChucVuModalThem').modal('hide');l
        } catch (error) {
            console.error('Error in addChucVu:', error);
        }
    }

    $('#btnAddChucVu').click(function(e) {
        e.preventDefault();
        addChucVu();
    });

    $('#btnUpdateChucVu').click(function(e) {
        e.preventDefault();
        var href = window.location.href;
        var url = new URL(href);
        var maCV = url.searchParams.get("maCV");
        const tenChucVu = $('#tenChucVuUpdate').val();
        const descChucVu = $('#descChucVuUpdate').val();
        const data = {
            maChucVu: maCV,
            tenChucVu: tenChucVu,
            mieuTa: descChucVu,
        };

        $.ajax({
            url: '/api/chuc-vu/update',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                alert(response);
                window.location.href = "/Admin/Quản-lý-chức-vụ"; // Điều hướng đến trang quản lý chức vụ
            },
            error: function(error) {
                alert('Cập nhật thất bại!');
                console.error('Error updating position:', error);
            }
        });

    });




    getAllChucVu()
});