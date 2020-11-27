"use strict";

/*
 * Copyright (C) 2017-2020 UBports Foundation <info@ubports.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const path = require("path");
const { heimdall } = require("../../lib/deviceTools.js");
const mainEvent = require("../../lib/mainEvent.js");

/**
 * Transform path array
 * @param {Array} files files
 * @param {String} device codename
 */
function addPathToFiles(files, device) {
  return files.map(file => ({
    ...file,
    file: path.join(cachePath, device, file.group, file.file)
  }));
}

/**
 * heimdall plugin
 */
class HeimdallPlugin {
  /**
   * fastboot:flash action
   * @returns {Promise}
   */
  flash({ partitions }) {
    return Promise.resolve().then(() => {
      mainEvent.emit("user:write:working", "particles");
      mainEvent.emit("user:write:status", "Flashing firmware", true);
      mainEvent.emit(
        "user:write:under",
        "Flashing firmware partitions using heimdall"
      );
      return heimdall.flash(
        addPathToFiles(step.flash, global.installProperties.device)
      );
    });
  }

  /* required by core:user_action
  wait() {
    mainEvent.emit("user:write:working", "particles");
    mainEvent.emit(
      "user:write:status",
      "Waiting for device",
      true
    );
    mainEvent.emit(
      "user:write:under",
      "Heimdall is scanning for devices"
    );
    function heimdallWait() {
      return heimdall
        .hasAccess()
        .then(access => {
          if (access) resolve();
          else
            mainEvent.emit("user:connection-lost", heimdallWait);
        })
        .catch(e => {
          log.warn(e);
          resolve();
        });
    }
    return heimdallWait();
  }
  */
}

module.exports = new HeimdallPlugin();
