app.factory('bdFactory', function($cordovaSQLite) {
  
  // Função para o select
  var _select = function(table, fields, where, order, limit) {
    var query = '';
    
    // Checa se foi setada uma tabela
    if(table) {
      
      // Verifica se é para pegar campos específicos
      if(!fields) { // Se não tiver campos específicos pega tudo da tabela
        query += "SELECT * ";
      } else {
        query += "SELECT ";

        for(var i = 0; i < fields.length; i++) {
          query += fields[i];

          if(i !== fields.length - 1)
            query += ", ";
        }
      }

      query += " FROM " + table;

      if(where) {
        query += " WHERE " + where;
      }

      if(order) {
        query += " ORDER BY " + order;
      }

      if(limit) {
        query += " LIMIT " + limit;
      }

      var result = [];

      return $cordovaSQLite.execute(db, query).then(function(res) {
        
        // Se retornar os resultados, monta um array com os objetos
        if(res.rows.length > 0) {
          var keys = [];
          keys = Object.keys(res.rows.item(0));

          for(var i = 0;i < res.rows.length;i++) {
            var obj = {};

            for(var j = 0;j < keys.length;j++) {
              obj[keys[j]] = res.rows.item(i)[keys[j]];
            }
            result.push(obj);
          }

          return result;
        } else {
          console.log("Sem resultados encontrados");
        }
      }, function (err) {
        console.error("Houve um erro na consulta");
      });
    }
    else
      console.error("Nenhuma tabela especificada");
  }

  var _insert = function(table, fields) {
    var query   = '';
    var columns = '';
    var values  = '';

    // Checa se alguma tabela foi passada
    if(table) {
      query += 'INSERT INTO ' + table;

      // Checa se os valores para serem inseridos foram passados
      if(fields) {
        columns += " (";
        values  += " VALUES(";
        
        // Monta a query dos campos e valores
        for(var i = 0;i < fields.length;i++) {
          columns += fields[i].column;
          values  += "'" + fields[i].value + "'";

          if(i !== (fields.length - 1)) {
            columns += ', ';
            values  += ', ';
          }
          else {
            columns += ')';
            values  += ');';
          }
        }

        query += columns + values;

        return $cordovaSQLite.execute(db, query).then(function(res) {
          return res.insertId;
        }, function(err) {
          console.error(err);
        });
      }
      else
        console.error("Sem valores para inserir");
    }
    else
      console.error("Nenhuma tabela especificada");
  }

  var _delete = function(table, where) {
    if (table) {
      var query = 'DELETE FROM ' + table;
      
      if(where)
        query += ' WHERE ' + where;

      return $cordovaSQLite.execute(db, query).then(function(res) {
        return true;
      }, function(err) {
        console.error(err);
      });
    }
    else
      console.error("Nenhuma tabela especificada");
  }

  return {
    select: _select,
    insert: _insert,
    delete: _delete
  }
});