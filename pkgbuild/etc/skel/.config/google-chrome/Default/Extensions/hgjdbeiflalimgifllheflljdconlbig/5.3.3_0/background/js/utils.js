var Utils = {
    waterfall: function (tasks, callback) {
        var next = function () {
            var _args = Array.prototype.slice.call(arguments);

            // si hay error o no hay mas tasks
            if ((_args[0] !== null && _args[0] !== undefined) || !tasks[currTask + 1]) {
                return callback.apply(null, _args);
            }

            currTask++;
            _args.shift();
            _args.push(next);

            return tasks[currTask].apply(null, _args);
        };

        var currTask = 0;
        tasks[currTask](next);
    }
};